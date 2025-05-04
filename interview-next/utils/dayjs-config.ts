import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 扩展dayjs，添加utc和时区支持
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置默认时区为中国时区
dayjs.tz.setDefault('Asia/Shanghai');

export default dayjs; 