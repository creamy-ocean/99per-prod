import { Global } from "@emotion/react";
import PretendardRegular from "@/fonts/Pretendard-Regular.woff2";
import PretendardMedium from "@/fonts/Pretendard-Medium.woff2";
import PretendardBold from "@/fonts/Pretendard-Bold.woff2";
import PretendardSemiBold from "@/fonts/Pretendard-SemiBold.woff2";

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'Pretendard-Regular';
        font-style: normal;
        font-display: swap;
        src: local('PretendardRegular'), url(${PretendardRegular}) format('woff2');
    }
    @font-face {
        font-family: 'Pretendard-Medium';
        font-style: normal;
        font-display: swap;
        src: local('PretendardMedium'), url(${PretendardMedium}) format('woff2');
    }
    @font-face {
        font-family: 'Pretendard-SemiBold';
        font-style: normal;
        font-display: swap;
        src: local('PretendardLight'), url(${PretendardSemiBold}) format('woff2');
    }
    @font-face {
        font-family: 'Pretendard-Bold';
        font-style: normal;
        font-display: swap;
        src: local('PretendardLight'), url(${PretendardBold}) format('woff2');
    }
        `}
  />
);

export default Fonts;
