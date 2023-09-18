/*
 * Workaround for @fastify/cookie types (they are not injected correctly)
 * Content of this file is copied from https://github.com/fastify/fastify-cookie/blob/master/types/plugin.d.ts
 */

import "fastify";
import * as fastifyCookie from "@fastify/cookie";

declare module "fastify" {
  interface FastifyInstance extends SignerMethods {
    /**
     * Serialize a cookie name-value pair into a Set-Cookie header string
     * @param name Cookie name
     * @param value Cookie value
     * @param opts Options
     * @throws {TypeError} When maxAge option is invalid
     */
    serializeCookie(name: string, value: string, opts?: fastifyCookie.SerializeOptions): string;

    /**
     * Manual cookie parsing method
     * @docs https://github.com/fastify/fastify-cookie#manual-cookie-parsing
     * @param cookieHeader Raw cookie header value
     */
    parseCookie(cookieHeader: string): {
      [key: string]: string;
    };
  }

  interface FastifyRequest extends SignerMethods {
    /**
     * Request cookies
     */
    cookies: { [cookieName: string]: string | undefined };
  }

  interface FastifyReply extends SignerMethods {
    /**
     * Request cookies
     */
    cookies: { [cookieName: string]: string | undefined };
  }

  interface SignerMethods {
    /**
     * Signs the specified cookie using the secret/signer provided.
     * @param value cookie value
     */
     signCookie(value: string): string;

    /**
     * Unsigns the specified cookie using the secret/signer provided.
     * @param value Cookie value
     */
    unsignCookie(value: string): fastifyCookie.UnsignResult;
  }

  export type setCookieWrapper = (
    name: string,
    value: string,
    options?: fastifyCookie.CookieSerializeOptions
  ) => FastifyReply;

  interface FastifyReply {
    /**
     * Set response cookie
     * @name setCookie
     * @param name Cookie name
     * @param value Cookie value
     * @param options Serialize options
     */
    setCookie(
      name: string,
      value: string,
      options?: fastifyCookie.CookieSerializeOptions
    ): this;

    /**
     * @alias setCookie
     */
    cookie(
      name: string,
      value: string,
      options?: fastifyCookie.CookieSerializeOptions
    ): this;

    /**
     * clear response cookie
     * @param name Cookie name
     * @param options Serialize options
     */
    clearCookie(
      name: string,
      options?: fastifyCookie.CookieSerializeOptions
    ): this;

    /**
     * Unsigns the specified cookie using the secret provided.
     * @param value Cookie value
     */
    unsignCookie(value: string): fastifyCookie.UnsignResult;
  }
}
