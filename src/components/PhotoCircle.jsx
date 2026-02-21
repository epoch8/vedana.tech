import React, { useState } from 'react';
import styles from './PhotoCircle.module.css';

export default function PhotoCircle({
  srcs = [],
  alt = 'Alexey Makhotkin'
}) {
  const list = Array.isArray(srcs) ? srcs : [srcs];
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(list.length === 0);
  const tryNext = () => {
    if (idx + 1 < list.length) setIdx(idx + 1);
    else setFailed(true);
  };
  return (
    <div className={styles.circle}>
      {!failed && list.length > 0 ? (
        <img src={list[idx]} alt={alt} className={styles.photo} onError={tryNext} />
      ) : (
        <div className={styles.initials}>AM</div>
      )}
    </div>
  );
}
