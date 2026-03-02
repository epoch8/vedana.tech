import styles from "./Chat.module.css";

const DEFAULTS = {
  bot: {
    name: "Vedana"
  },
  user: {
    name: "You"
  }
};

export default function ChatItem({
  participant,
  text,
  children,
  participant1,
  participant2
}) {
  let p;

  if (participant1 && participant2) {
    const isLeft = participant === 1;
    p = isLeft ? participant1 : participant2;
  } else {
    p = participant === 1 ? DEFAULTS.bot : DEFAULTS.user;
  }

  const isLeft = participant === 1;

  return (
    <div
      className={`${styles.messageRow} ${
        isLeft ? styles.left : styles.right
      }`}
    >
      {isLeft && <div className={styles.avatar}>
        <div className={styles.avatarPlaceholder}></div>
      </div>}

      <div className={styles.messageBlock}>
        <div className={styles.name}>{p.name}</div>

        <div className={styles.bubble}>
          {children ? children : text}
        </div>
      </div>

      {!isLeft && <div className={styles.avatar}>
        <div className={styles.avatarPlaceholder}></div>
      </div>}
    </div>
  );
}