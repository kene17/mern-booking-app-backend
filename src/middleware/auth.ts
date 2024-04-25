import { Request, Response, NextFunction, RequestHandler } from 'express';
import { check, validationResult, ValidationChain } from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';

//adds userId to the request type
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
// Define a type that encompasses the entire middleware sequence
type MiddlewareSequence = (RequestHandler | ValidationChain)[];

export const validateUser: MiddlewareSequence = [
  check('firstName').not().isEmpty().withMessage('First name is required'),
  check('lastName').not().isEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  // This function needs to be explicitly typed to satisfy TypeScript
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

export const validateLoginUser: MiddlewareSequence = [
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  // This function needs to be explicitly typed to satisfy TypeScript
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['auth_token'];
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'unauthorized' });
  }
};
