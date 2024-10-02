import { styled } from "./theme";
// import { device } from "./theme/device";
import { Button } from "antd";

export const StyledButton = styled(Button)`
  background-color: #d44640;
  color: white;
  border-radius: 2px;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border: 1px solid #d54640;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:hover,
  &:active,
  &:focus {
    background-color: #ac2b26;
    color: white;
  }
`;

export const ContentHeaderWrapper = styled.div`
  background-color: #fff;
  margin-left: 12px;
  box-shadow: 0 0 2px gray;
  padding: 15px;
  @media screen and (max-width: 992.5px) {
    margin-left: 0px;
  }
`;

export const ContentWrapper = styled.div`
  background-color: #fff;
  margin-top: 15px;
  margin-left: 12px;
  box-shadow: 0 0 2px gray;
  @media screen and (max-width: 992.5px) {
    margin-left: 0px;
  }
`;

export const ContentWrapperPayment = styled.div`
  background-color: #fff;
  margin-top: 15px;
  @media screen and (max-width: 992.5px) {
    margin-left: 0px;
  }
`;

export const ContentTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  border-bottom: 1px solid rgb(196, 196, 196);
  padding: 10px 17px;
`;

export const ContentFormWrapper = styled.div`
  padding: 15px;
`;

export const WarningText = styled.p`
  color: crimson;
  font-style: italic;
`;
