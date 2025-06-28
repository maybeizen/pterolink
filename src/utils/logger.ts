import chalk from "chalk";

class Logger {
  private log: (message?: any, ...optionalParams: any[]) => void;

  constructor() {
    this.log = console.log;
  }

  getTimestamp(): string {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
  }

  formatLog(color: keyof typeof chalk, tag: string, message: string): void {
    this.log(
      chalk.gray(`[${this.getTimestamp()}]`) +
        (chalk[color] as any)(` (${tag}) ${message}`)
    );
  }

  info(message: string): void {
    this.formatLog("cyan", "INFO", message);
  }

  error(message: string): void {
    this.formatLog("red", "ERROR", message);
  }

  success(message: string): void {
    this.formatLog("green", "SUCCESS", message);
  }

  warn(message: string): void {
    this.formatLog("yellow", "WARN", message);
  }

  debug(message: string): void {
    this.formatLog("gray", "DEBUG", message);
  }
}

const logger = new Logger();

export { logger };
