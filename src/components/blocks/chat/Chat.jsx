import styles from "./Chat.module.css";

export default function Chat({
  title,
  showDate = false,
  dateLabel,
  reactions = [],
  inputPlaceholder = "Type a message",
  inputValue = "",
  showSendButton = true,
  children
}) {
  return (
    <div className={styles.chat}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}

      <div className={styles.messages}>
        {showDate && dateLabel && (
          <div className={styles.date}>{dateLabel}</div>
        )}

        {children}

        {reactions.length > 0 && (
          <div className={styles.reactions}>
            {reactions.map((r, i) => (
              <button key={i} type="button" className={styles.reaction}>
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          {inputValue ? (
            <span className={styles.inputValue}>{inputValue}</span>
          ) : (
            <span className={styles.placeholder}>{inputPlaceholder}</span>
          )}
        </div>

        {showSendButton && (
          <button type="button" className={styles.sendBtn}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.sendIcon}
            >
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}