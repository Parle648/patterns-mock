const fs = require('fs');
const path = require('path');

// PATTERN: observer
export class Observer {
    update(message, level) {
      throw new Error('You have to implement the method update!');
    }
}

export class FileLogger extends Observer {
    public filename
    public logFilePath

    constructor(filename) {
        super();
        this.filename = filename;
        this.logFilePath = path.join(__dirname, filename);
    }

    update(message, level) {
        const logMessage = `${new Date().toISOString()} - ${level.toUpperCase()} - ${message}\n`;
        fs.appendFileSync(this.logFilePath, logMessage, 'utf8');
    }
}

export class ConsoleLogger extends Observer {
  update(message, level) {
    if (level === 'error') {
      console.error(`ERROR: ${message}`);
    }
  }
}

export class LoggerPublisher {
    public subscribers
    constructor() {
      this.subscribers = [];
    }
  
    subscribe(subscriber) {
      this.subscribers.push(subscriber);
    }
  
    unsubscribe(subscriber) {
      this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    }
  
    notify(message, level) {
      this.subscribers.forEach(subscriber => subscriber.update(message, level));
    }
  
    log(message, level) {
      this.notify(message, level);
    }
}
 
export const publisher = new LoggerPublisher();

const fileLogger = new FileLogger('app.log');
const consoleLogger = new ConsoleLogger();

publisher.subscribe(fileLogger);
publisher.subscribe(consoleLogger);