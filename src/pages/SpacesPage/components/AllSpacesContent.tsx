import React from 'react';
import { Typography } from '@mui/material';

// AllSpacesContent가 받는 props 타입을 정의합니다.
interface AllSpacesContentProps {
  onAddSpace: () => void;
}

// 실제 내용은 나중에 채우고, 일단은 간단한 텍스트만 보여주도록 합니다.
const AllSpacesContent = ({ onAddSpace }: AllSpacesContentProps) => {
  // onAddSpace를 사용하지 않는다는 경고가 뜰 수 있지만, 일단은 무시해도 괜찮습니다.
  // 나중에 '스페이스 추가하기' 버튼을 만들 때 사용될 예정입니다.
  console.log(onAddSpace); // 임시로 사용해서 경고 없애기
  return <Typography>전체 스페이스 콘텐츠가 여기에 표시됩니다.</Typography>;
};

export default AllSpacesContent;
