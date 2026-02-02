import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyBaseSeo } from "@/seo";

const DEFAULT_TITLE = "MuzikPick - 음악을 기록하다";
const DEFAULT_DESCRIPTION =
  "MuzikPick은 앨범을 평가하고 리뷰를 나누며 새로운 음악을 발견하는 음악 기록 플랫폼입니다.";

const SeoUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    applyBaseSeo({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default SeoUpdater;
