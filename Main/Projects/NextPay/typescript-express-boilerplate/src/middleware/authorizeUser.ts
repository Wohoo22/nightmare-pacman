import axios from 'axios';

export default function initVerifyAccessTokenMiddleware({
  ignoredPaths,
  authorizationUrl,
}: {
  ignoredPaths: string[],
  authorizationUrl: string
}) {
  const isIgnored = (path: string): boolean => {
    const pathSegments: string[] = path.split('/');
    let pathMatchPattern: boolean = true;
    ignoredPaths.forEach((pattern: string) => {
      const patternSegments: string[] = pattern.split('/');
      patternSegments.forEach((patternSegment: string, index: number) => {
        if (index >= pathSegments.length) {
          return;
        }
        const isPathParam = () => patternSegments.length > 0 && patternSegments[0] === ':';
        const pathSegment: string = pathSegments[index];
        if (!isPathParam && patternSegment !== pathSegment) {
          pathMatchPattern = false;
        }
      });
    });
    return pathMatchPattern;
  };

  const verifyAccessToken = async (req: any, res: any, next: any): Promise<any> => {
    try {
      const token: string = req.headers['x-access-token'];
      const { path }: { path: string } = req;
      if (isIgnored(path)) {
        return next();
      }
      if (!token) {
        return {};
      }
      const authorizeResult: any = await axios.post(authorizationUrl, {
        path,
        method: req.method,
      }, {
        timeout: 10000,
        headers: {
          'x-access-token': token,
        },
      });
      const {
        success,
        data: userAuthorization,
      }: {
        success: boolean,
        data: any
      } = authorizeResult.data;
      if (success) {
        userAuthorization.from = 'MERCHANT_PORTAL';
        req.user = userAuthorization;
        return next();
      }
      return res.status(500).send({
        success: false,
        message: 'Unknown error',
        code: 'INTERNAL_SERVER_ERROR',
        data: {
          authorizeResult,
        },
      });
    } catch (e) {
      if (e.statusCode) {
        return res.status(e.statusCode).send(e.error);
      }
      return res.status(500).send({
        success: false,
        message: e.message,
        code: 'INTERNAL_SERVER_ERROR',
        data: null,
      });
    }
  };

  return verifyAccessToken;
}
