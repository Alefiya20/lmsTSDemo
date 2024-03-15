/*import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a user type representing the decoded user information
interface User {
    // Define your user properties here
    userId: string;
    // Add any other properties you might have in your decoded token
}

// Extend the Request type to include the user property
interface RequestWithUser extends ExpressRequest {
    user?: User;
}

const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        jwt.verify(token, 'Alefiya', (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
            } else {
                // Ensure that decoded is of type JwtPayload
                const decodedPayload = decoded as JwtPayload;

                // Attach the decoded user information to the request for further use
                req.user = {
                    userId: decodedPayload.userId, // Replace with the actual property name from your decoded token
                    // Add any other properties you might have in your decoded token
                };

                next(); // Proceed to the next middleware or route handler
            }
        });
    }
};

export default verifyToken;*/
