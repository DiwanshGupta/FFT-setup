import React, { FC } from 'react'
import { Modal, Box } from "@mui/material";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: any;
    component: any;
    route: string;
    setRoute?: (route: string) => void;
}

const CustomModal: FC<Props> = ({ open, setOpen, route, setRoute, component: Component }) => {
    return (
        <Modal
            open={ open }
            onClose={ () => setOpen(false) }
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className={ `
                    ${route === "Login" && ("top-[25%] bottom-[5%]")} 
                    ${route === "SignUp" && ("top-[10%] bottom-[3%]")} 
                    ${route === "Verification" && ("top-[25%] bottom-[10%]")} 
                    absolute left-[50%] -translate-x-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none` 
                }
            >
                <Component setOpen={ setOpen } setRoute={ setRoute } />
            </Box>
        </Modal>
    )
}

export default CustomModal
