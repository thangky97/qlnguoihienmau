import React from "react";

const CoverLayer: React.FC<{
  children: React.ReactNode;
  isShow: boolean;
  hiddenCover: () => void;
}> = props => {
  return (
    <>
      {props.isShow ? (
        <div className="absolute w-[100%] h-[100%] z-10 c2i-cover top-0 left-0">
          <div className="relative w-[100%] h-[100%] z-11">
            {props.children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CoverLayer;
