import winston from "winston";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    create: 3,
    update: 4,
    delete: 5,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    create: "blue",
    update: "magenta",
    delete: "cyan",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
