import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区
const DEFAULT_TIMEZONE = "Europe/Rome";

// 创建一个封装的 `dayjs` 方法，默认使用 `Asia/Shanghai`
const date = (date?: dayjs.ConfigType): Dayjs =>
  dayjs(date).tz(DEFAULT_TIMEZONE);

export default date;
