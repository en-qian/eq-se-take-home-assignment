import { ERROR_CODE } from '@constants';
import type { Request, RequestHandler } from 'express';
import type { RouteParameters } from 'express-serve-static-core';
import { ErrorResponse } from './error-handler';
import * as v from './validators';
import * as aesUtils from './aes';

export type PrimitiveType = string | number | boolean | null;

export type JSONObject = {
  [k: string]:
    | PrimitiveType
    | JSONObject
    | (PrimitiveType | JSONObject)[]
    | undefined;
};

export interface BaseApi {
  Method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  Route: string;
  ReqParams: Record<string, string>;
  ReqQuery: Record<string, string | string[] | undefined>;
  ReqBody: JSONObject;
  ResBody: JSONObject | string | undefined | RedirectResponse;
}

type SuccessStatusCode = 200 | 201 | 204;
type NoContentResponse = { statusCode: 204 };
type ManualResponse = { manualResponse: true };
type RedirectResponse =
  | { statusCode: 301; url: string }
  | { statusCode: 302; url: string };

export type ExpressHandler<
  T extends BaseApi,
  ResLocals extends Record<string, any>
> = RequestHandler<
  T['ReqParams'] & RouteParameters<T['Route']>,
  T['ResBody'],
  T['ReqBody'],
  T['ReqQuery'],
  ResLocals
>;

export type Controller<
  T extends BaseApi,
  ResLocals extends Record<string, any>
> = (...args: Parameters<ExpressHandler<T, ResLocals>>) => Promise<
  | ManualResponse
  | (T['ResBody'] extends undefined
      ? NoContentResponse | RedirectResponse
      : {
          statusCode?: SuccessStatusCode;
          data: T['ResBody'];
        })
>;

export interface ResponseLocalUser {}

export interface ResponseLocals {
  user: ResponseLocalUser;
}

export const isErrorResponse = (err: any): err is ErrorResponse => {
  if (
    v.hasKey(ERROR_CODE)(err.errorCode) &&
    typeof err.statusCode === 'number' &&
    typeof err.message === 'string'
  ) {
    return true;
  }
  return false;
};

export const getRawUserIP = (req: Request) => {
  const address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (typeof address !== 'string') return null;

  return address;
};

export const getUserIP = (req: Request) => {
  const address = getRawUserIP(req);
  if (!address) return null;

  const result = address.split(',')[0]?.split(':');

  if (!result) return null;
  return result[result.length - 1] || null;
};

export const createController =
  <T extends BaseApi, ResLocals extends Record<string, any> = ResponseLocals>(
    controller: Controller<T, ResLocals>
  ): ExpressHandler<T, ResLocals> =>
  async (req, res, next) => {
    try {
      const DEFAULT_STATUS_CODE: SuccessStatusCode = 200;

      const encryptedData = req.body.data as string | undefined;

      if (encryptedData) {
        try {
          const parsedData = JSON.parse(aesUtils.decrypt(encryptedData));

          req.body = parsedData;
        } catch (error) {
          console.log(error);
          req.body = req.body;
        }
      }

      const controllerResult = await controller(req, res, next);

      const isManualResponse = (
        input: typeof controllerResult
      ): input is ManualResponse => {
        return Boolean((input as any)?.manualResponse);
      };

      if (isManualResponse(controllerResult)) {
        // response was already handled in controller
        return;
      }

      let data: T['ResBody'];
      let redirectUrl: string | undefined = undefined;

      type StatusCode = SuccessStatusCode | RedirectResponse['statusCode'];
      let statusCode: StatusCode = DEFAULT_STATUS_CODE;
      if (
        controllerResult.statusCode === 204 ||
        controllerResult.statusCode === 301 ||
        controllerResult.statusCode === 302
      ) {
        data = undefined;
        statusCode = controllerResult.statusCode;
        redirectUrl = (controllerResult as any)?.url as string | undefined;
      } else {
        data = controllerResult.data;
        if (controllerResult.statusCode !== undefined) {
          statusCode = controllerResult.statusCode;
        }
      }

      if (data) {
        const encrypted = aesUtils.encrypt(JSON.stringify(data));

        res.status(statusCode).send({ data: encrypted });
      } else {
        if (redirectUrl && (statusCode === 301 || statusCode === 302)) {
          res.redirect(statusCode, redirectUrl);
        } else {
          res.sendStatus(statusCode);
        }
      }
    } catch (err: any) {
      if (err.statusCode) {
        res.status(err.statusCode).send({
          error: err.errorCode,
          message: err.message,
          statusId: err.statusId,
        });
      } else {
        console.log(err);
        res.status(500).send({
          error: 'SERVER_ERROR',
          message: 'Unexpected error. Please try again later.',
        });
      }
    }
  };

export const getCommonQuery = (req: Request) => {
  const { limit, offset, keyword } = req.query;

  if (limit !== undefined) {
    if (!v.min(0, 'number')(Number(limit)) && !v.isInteger(Number(limit))) {
      throw new ErrorResponse('INVALID_PARAMS', 'Invalid limit');
    }
  }

  if (offset !== undefined) {
    if (!v.min(0, 'number')(Number(offset)) && !v.isInteger(Number(offset))) {
      throw new ErrorResponse('INVALID_PARAMS', 'Invalid offset');
    }
  }

  if (keyword !== undefined) {
    if (!v.min(1, 'string')(Number(keyword))) {
      throw new ErrorResponse('INVALID_PARAMS', 'Invalid keyword');
    }
  }

  return {
    limit: Number(limit) || undefined,
    offset: Number(offset) || undefined,
    keyword: keyword ? String(keyword) : undefined,
  };
};
