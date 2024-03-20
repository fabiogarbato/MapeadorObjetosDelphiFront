import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
    position: "top-right",
    autoClose: 1800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const showMessageSuccess = (mensagem) => {
    toast.success(mensagem, toastOptions);
}

export const showMessageError = (mensagem) => {
    toast.error(mensagem, toastOptions);
}

export const showMessageWarn = (mensagem) => {
    toast.warn(mensagem, toastOptions);
}

export const showMessageInfo = (mensagem) => {
    toast.info(mensagem, toastOptions);
}

export const showMessagedefault = (mensagem) => {
    toast(mensagem, toastOptions);
}
