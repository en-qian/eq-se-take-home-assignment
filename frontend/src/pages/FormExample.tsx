import {
  faChevronDown,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

const FormExample = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState<'option_1' | 'option_2'>(
    'option_1'
  );
  const [isChecked, setIsChecked] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // do something here...

      toast.success('Submitted');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Unexpected Error. Please try again later.'
      );
    }
  };

  return (
    <div className="home page">
      <div className="container">
        <h1>Form Example</h1>

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
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

          <div className="form-row">
            <label htmlFor="select-field">Select Field Example</label>
            <div className="select-wrapper">
              <select
                id="select-field"
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
                required
              >
                <option value="">-- Select an option --</option>
                <option value={'value-1'}>Option 1</option>
                <option value={'value-2'}>Option 2</option>
                <option value={'value-3'}>Option 3</option>
              </select>

              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>

          <div className="form-row radio-row">
            <label htmlFor="option-1">
              <input
                id="option-1"
                type="radio"
                value="option-1"
                checked={radioValue === 'option_1'}
                onChange={() => setRadioValue('option_1')}
              />
              Option 1
            </label>

            <label htmlFor="option-2">
              <input
                id="option-2"
                type="radio"
                value="option-2"
                checked={radioValue === 'option_2'}
                onChange={() => setRadioValue('option_2')}
              />
              Option 2
            </label>
          </div>

          <div className="form-row checkbox-row">
            <label htmlFor="checkbox-tac">
              By checking this box, you agree to the Terms of Service and
              acknowledge the Privacy Policy.
              <input
                id="checkbox-tac"
                type="checkbox"
                checked={isChecked}
                onChange={e => setIsChecked(e.target.checked)}
                required
              />
            </label>
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

export default FormExample;
