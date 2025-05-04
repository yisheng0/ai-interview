/**
 * JWT工具函数
 * 用于JWT token的解析和验证
 */

/**
 * 解析JWT Token
 * @param token JWT token字符串
 * @returns 解析后的token载荷
 */
export function parseJwt(token: string): any {
  try {
    // Base64解码JWT payload部分
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * 获取JWT过期时间
 * @param token JWT token字符串
 * @returns 过期时间的时间戳（毫秒），如果无法解析则返回null
 */
export function getTokenExpiry(token: string | null): number | null {
  if (!token) return null;
  
  try {
    const decodedToken = parseJwt(token);
    
    // JWT标准中，exp字段表示过期时间，以秒为单位
    if (decodedToken && decodedToken.exp) {
      // 转换为毫秒
      return decodedToken.exp * 1000;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 检查JWT是否过期
 * @param token JWT token字符串
 * @returns 是否过期，true表示已过期，false表示未过期或无法解析
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  
  // 当前时间大于过期时间，表示已过期
  return Date.now() > expiry;
}

/**
 * 从TokenJWT中获取用户ID
 * @param token JWT token字符串
 * @returns 用户ID
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  
  try {
    const decodedToken = parseJwt(token);
    return decodedToken?.userId || null;
  } catch (error) {
    return null;
  }
} 