import * as utils from '@utils';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = utils.axiosInstance;

export const getExample = async () => {
  try {
    const response = await axiosInstance.get<{ example: any }>(
      `${BASE_URL}/example`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postExample = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post<{
      example: string;
    }>(`${BASE_URL}/User/VerifyUser`, {
      data: utils.encrypt({
        username: username,
        password: utils.generateHash('sha1')(password),
      }),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  // Dummy api to get user list
  try {
    const response = await axiosInstance.get<
      {
        id: number;
        name: string;
        username: string;
        email: string;
        address: {
          street: string;
          suite: string;
          city: string;
          zipcode: string;
          geo: {
            lat: string;
            lng: string;
          };
        };
        phone: string;
        website: string;
        company: {
          name: string;
          catchPhrase: string;
          bs: string;
        };
      }[]
    >(`https://jsonplaceholder.typicode.com/users`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string) => {
  // Dummy api to get user  details
  try {
    const response = await axiosInstance.get<{
      id: number;
      name: string;
      username: string;
      email: string;
      address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
          lat: string;
          lng: string;
        };
      };
      phone: string;
      website: string;
      company: {
        name: string;
        catchPhrase: string;
        bs: string;
      };
    }>(`https://jsonplaceholder.typicode.com/users/${userId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
