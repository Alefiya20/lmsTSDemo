import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/user';
import config from '../config';

interface DecodedToken {
    userId: string;
}

export const signup = async (req: Request, res: Response) => {
    const {
      first_name,
      second_name,
      email,
      dob,
      city,
      country,
      address,
      phone_number,
      password,
      status,
    } = req.body;
  
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Hashing password
      const hashedPassword = await bcrypt.hash(password, config.saltRounds);
  
      //new user
      const newUser = new User({
        first_name,
        second_name,
        email,
        dob,
        city,
        country,
        address,
        phone_number,
        password: hashedPassword,
        status,
      });
  
      // Save the user 
      await newUser.save();
  
      //Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, {
        expiresIn: '1h', // Token expiration time
      });
  
      
      res.status(201).json({ success:true, message: 'User registered successfully',result:newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success:false, message: 'Internal server error' });
    }
  };

  export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: '1h', // Token expiration time
      });
  
      
      res.status(200).json({success:true, message: 'Login successful',result:user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: 'Internal server error' });
    }
  };

const SECRET_KEY = 'Alefiya';
const EMAIL_SECRET = 'your-email-secret-key';
const EMAIL_SERVICE = 'gmail';  
const EMAIL_USER = 'alefiyatest@gmail.com';
const EMAIL_PASS = 'mxrq rodv yrie edwk';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a token for resetting the password
    //const resetToken = jwt.sign({ userId: user._id }, EMAIL_SECRET, { expiresIn: '1h' });

    // Send the reset password link to the user's email
    //const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>You are recieveing this email because you have requested the reset of the password for your account</p>
      <p> Please click on the following link:</p>
      <p> ${"http://localhost:5173"}/resetPassword/${user._id}</p>
      <p>If you did'nt request this, please ignore this email</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }

      console.log('Email sent:',info);

      return res.status(200).json({ success:true, message: 'Password reset link sent to your email' });
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({success:false, message: 'Internal Server Error' });
  }
};

  export const resetPassword = async (req: Request, res: Response) => {
    const {Password, _id } = req.body;
  
    try {
      // Check if the user exists
      const existingUser = await User.findById(_id);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Update the user's password
      existingUser.password = hashedPassword;
      await existingUser.save();
  
      res.status(200).json({success:true, message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: 'Internal server error' });
    }
  };

  export const changePassword = async (req: Request, res: Response) => {
    const { _id, newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(_id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
  
      
      await user.save();
  
      res.status(200).json({success:true, message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: 'Internal server error' });
    }
  };
  
  export const updateProfile = async (req: Request, res: Response) => {
    const { _id } = req.body; 
    const updateFields = req.body;
  
    try {
      // Check if the user exists
      const existingUser = await User.findById(_id);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user profile fields
      for (const field in updateFields) {
        if (Object.prototype.hasOwnProperty.call(updateFields, field)) {
          // Check if the field exists in the updateFields object
          existingUser.set(field, updateFields[field]);
        }
      }

      // Save the updated user profile
      await existingUser.save();
      // Fetch the updated user details
    const updatedUser = await User.findById(_id);
  
      res.status(200).json({success:true, message: 'Profile updated successfully',result:updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success:false, message: 'Internal server error' });
    }
  };

  export const deleteUser = async (req: Request, res: Response) => {
    const { _id } = req.body; 
  
    try {
      // Check if the user exists
      const existingUser = await User.findById(_id);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Soft delete: Set the 'deleted' field to true
      existingUser.deleted = true;
  
      // Save the updated user profile
      await existingUser.save();
  
      res.status(200).json({success:true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success:false,message: 'Internal server error' });
    }
  };

  
  export const seeProfileDetail = async (req: Request, res: Response) => {
    const { _id } = req.body; 
  
    try {
      // Find the user by id
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    
      const userProfile = {
        first_name: user.first_name,
        second_name: user.second_name,
        email: user.email,
        dob: user.dob,
        city: user.city,
        country: user.country,
        address: user.address,
        phone_number: user.phone_number,
        status: user.status,
      };
  
      res.status(200).json({ success:true, message:"", result:userProfile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success:false, message: 'Internal server error' });
    }
  };
  
  const ITEMS_PER_PAGE = 10;


/*export const getUserList = async (req: Request, res: Response) => {
  const { page = 1, searchTerm = '' } = req.query;

  try {
    const searchTermString = searchTerm as string;
    const filter:Record<string,any> = {
      $or: [
        { first_name: { $regex: new RegExp(searchTermString, 'i') } },
        { second_name: { $regex: new RegExp(searchTermString, 'i') } },
        { phone_number: { $regex: new RegExp(searchTermString, 'i') } },
        { country: { $regex: new RegExp(searchTermString, 'i') } },
      ],
    };

    const totalUsers = await User.countDocuments(filter);

    const userList = await User.find(filter)
      .skip((Number(page) - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .select('first_name second_name phone_number country');

    res.status(200).json({
      userList,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/
/*export const getUserList = async (req: Request, res: Response) => {
  const { page = 1, searchTerm = '' } = req.query;

  try {
    const searchTermString = searchTerm as string;
    const searchTermFirstLetter = searchTermString.charAt(0).toUpperCase();
    
    const filter: Record<string, any> = {
      $or: [
        { first_name: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { second_name: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { phone_number: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { country: { $regex: new RegExp('^' + searchTermString, 'i') } },
      ],
    };

    // Sorting based on the first letter of the first_name
    const sortCriteria = 'first_name'; // Sorting based on first_name field

    const totalUsers = await User.countDocuments(filter);

    const userList = await User.find(filter)
      .sort(sortCriteria)
      .skip((Number(page) - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .select('first_name second_name phone_number country');

    res.status(200).json({
      userList,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};*/
export const getUserList = async (req: Request, res: Response) => {
  const { page = 1, searchTerm = '' } = req.query;

  try {
    const searchTermString = searchTerm as string;
    const searchTermFirstLetter = searchTermString.charAt(0).toUpperCase();
    
    const filter: Record<string, any> = {
      $or: [
        { first_name: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { second_name: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { phone_number: { $regex: new RegExp('^' + searchTermString, 'i') } },
        { country: { $regex: new RegExp('^' + searchTermString, 'i') } },
      ],
    };

    // Filtering based on the first letter of the search term
    if (searchTermFirstLetter) {
      filter.$or.push({
        first_name: { $regex: new RegExp('^' + searchTermFirstLetter, 'i') }
      });
    }

    const totalUsers = await User.countDocuments(filter);

    const userList = await User.find(filter)
      .skip((Number(page) - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .select('first_name second_name phone_number country');

    res.status(200).json({success:true,
      result:userList,
      message:"",
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,message: 'Internal server error' });
  }
};