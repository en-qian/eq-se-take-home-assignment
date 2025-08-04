import loginBanner from '@assets/login_banner.jpg';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as authApi from '@api/auth';
import * as utils from '@utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const userData = utils.getCookie('user_data');

  if (userData) {
    window.location.href = '/';
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.loading('Login...');

    try {
      toast.dismiss();

      await authApi.login(email, password);

      window.location.href = '/';
    } catch (error: any) {
      console.log(error);
      toast.dismiss();

      setTimeout(
        () =>
          toast.error(
            error.response?.data?.message ||
              'Unexpected Error. Please try again later.'
          ),
        500
      );
    }
  };

  return (
    <div className="login page" style={{ padding: 0 }}>
      <div className="container" style={{ maxWidth: '100%' }}>
        <div
          className="login-banner"
          style={{
            minHeight: '400px',
            backgroundImage: `url(${loginBanner})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#000000',
          }}
        ></div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          style={{
            maxWidth: '680px',
            margin: '-50px auto',
            backgroundColor: 'var(--medium-orange)',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="off"
              />

              <span
                className="password-toggle"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>

          <div className="submit-button-wrapper">
            <button className="submit-button" value={'submit'}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
