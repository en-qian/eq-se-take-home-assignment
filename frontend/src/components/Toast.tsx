import {
  ToastContainer,
  cssTransition,
  toast,
  TypeOptions,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Fade = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
  collapseDuration: 500,
});

export const showToast = (msg: string, type: TypeOptions = 'success') => {
  toast(msg, {
    type,
    // transition: Fade,
  });
};

const ToastWrapper = () => (
  <ToastContainer limit={1} position={'top-center'} autoClose={1500} />
);

export default ToastWrapper;
