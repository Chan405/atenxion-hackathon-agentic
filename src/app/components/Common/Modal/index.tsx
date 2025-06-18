import { Box, Modal, Theme, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";
import ButtonComponent from "../ButtonComponent";

import theme from "@/app/utils/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SubHeading from "../../Typeface/SubHeading";
import BodyText from "../../Typeface/BodyText";
interface ModalContainerProps {
  open: boolean;
  handleClose: () => void;
  maxHeight?: string;
  children?: ReactNode;
  title: string;
  description?: string;
  cancelBtnText: string;
  cancelBtnHandler?: () => void;
  confirmBtnText: string;
  confirmBtnHandler?: (values?: any) => void;
  loading?: boolean;
  width?: string;
  height?: string;
  buttonWidth?: string;
  isEditModal?: boolean;
  // checked?: boolean;
  // handleChecked?: any;
  btnDisabled?: boolean;
  bgColor?: string;
  buttonFlex?: string;
  btnColor?: string;
  showBackButton?: boolean;
  titleCenter?: boolean;
  isIntegration?: boolean;
  showDeleteBtn?: boolean;
  confirmDelete?: () => void;
}
import CloseIcon from "@mui/icons-material/Close";
import OutlineButton from "../OutlineButton";

function ModalContainer({
  showDeleteBtn = false,
  open,
  handleClose,
  children,
  title,
  description,
  cancelBtnText,
  cancelBtnHandler,
  confirmBtnText,
  confirmBtnHandler,
  width,
  height,
  loading,
  buttonWidth,
  isEditModal,
  btnDisabled,
  bgColor,
  maxHeight,
  showBackButton = false,
  isIntegration,
  confirmDelete,
}: ModalContainerProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(900));

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "80%" : width ? width : "33%",
    height: height ? height : "auto",
    bgcolor: bgColor || theme.palette.custom.white,
    borderRadius: "8px",
    boxShadow: "none",
    py: 2,
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <Box
            px={3}
            pb={2}
            display="flex"
            flexDirection="column"
            gap={"12px"}
            borderBottom="1px solid #E6E6E6"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {showBackButton && (
                <Box
                  bgcolor="secondary.light"
                  height="36px"
                  width="36px"
                  borderRadius="100px"
                  textAlign="center"
                  alignContent="center"
                >
                  <ArrowBackIcon
                    onClick={handleClose}
                    style={{
                      color: "#052659",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
              {/* <SubTitle text={title} /> */}
              <SubHeading
                fontSize="18px"
                textAlign="center"
                color="#052659"
                flex={1}
                ml={1}
              >
                {title}
              </SubHeading>
              <Box
                bgcolor="secondary.light"
                height="36px"
                width="36px"
                borderRadius="100px"
                textAlign="center"
                alignContent="center"
              >
                <CloseIcon
                  onClick={handleClose}
                  style={{
                    color: "#636464",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
            {description && (
              <BodyText variant="medium" mb={1}>
                {description}
              </BodyText>
            )}
          </Box>
          <Box px={3} maxHeight={"70vh"} overflow={"auto"}>
            {children}
          </Box>
        </Box>

        {!isIntegration && (
          <Box
            display="flex"
            gap={1.5}
            px={3}
            pt={2}
            borderTop="1px solid #E6E6E6"
            justifyContent={"flex-end"}
          >
            {cancelBtnText.length > 0 && (
              <OutlineButton
                label={cancelBtnText}
                width="105px"
                height="42px"
                background="#f2f2f2"
                borderRadius="8px"
                showBorder={false}
                onClick={handleClose}
              />
            )}
            <ButtonComponent
              label={confirmBtnText}
              width={buttonWidth ? buttonWidth : "120px"}
              height="41px"
              color="#052659"
              borderRadius="8px"
              onClick={confirmBtnHandler}
              loading={loading}
              disabled={btnDisabled}
            />
            {showDeleteBtn && (
              <ButtonComponent
                label={"Remove"}
                width={buttonWidth ? buttonWidth : "120px"}
                height="41px"
                borderRadius="8px"
                onClick={confirmDelete}
                loading={loading}
                disabled={btnDisabled}
                color="#EF476F"
                textColor="#fff"
              />
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default ModalContainer;
