"use strict";
// import express, { Request, Response } from 'express';
// import { Messages } from '../Constants/Messages';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// // Ensure the upload directory exists
// const uploadDir = path.join(__dirname, '../../upload');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// const storage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb: Function) => {
//     cb(null, uploadDir);
//   },
//   filename: (req: Request, file: Express.Multer.File, cb: Function) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// export const upload = multer({ storage });
// // Upload File API
// export const uploadFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ message: Messages.NoFileFound });
//       return;
//     }
//     res.status(200).json({
//       message: Messages.FileUpload,
//       timestamp: new Date().toISOString(),
//       fileDetails: {
//         file: req.file,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//   }
// };
// // Get file by ID (filename)
// export const getFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const filename = req.params.filename;
//     const imagePath = path.join(uploadDir, filename);
//     if (fs.existsSync(imagePath)) {
//       res.sendFile(imagePath);
//     } else {
//       res.status(404).json({ message: Messages.FileNotFound });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//   }
// };
// // Get all files
// export const getallFiles = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const files = fs.readdirSync(uploadDir);
//     if (files.length > 0) {
//       const fileDetails = files.map(file => ({
//         filename: file,
//         url: `${req.protocol}://${req.get('host')}/files/${file}`, // Dynamically generate the file URL
//       }));
//       res.status(200).json({
//         message: 'Files found',
//         files: fileDetails,
//       });
//     } else {
//       res.status(404).json({ message: Messages.NoFileFound });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//   }
// };
// // Delete file
// export const deleteFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { filename } = req.params;
//     const filePath = path.join(uploadDir, filename);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath); // Delete the file
//       res.status(200).json({
//         message: `File ${filename} deleted successfully.`,
//       });
//     } else {
//       res.status(404).json({ message: `File ${filename} not found.` });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//   }
// };
// // Update file
// export const updateFile = [
//   upload.single('image'),
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { filename } = req.params;
//       const uploadedFile = req.file;
//       if (!uploadedFile) {
//         res.status(400).json({ message: Messages.NoFileFound });
//         return;
//       }
//       const oldFilePath = path.join(uploadDir, filename);
//       const newFilePath = path.join(uploadDir, uploadedFile.originalname);
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath); // Delete the old file
//       } else {
//         res.status(404).json({ message: `File ${filename} not found` });
//         return;
//       }
//       fs.renameSync(uploadedFile.path, newFilePath); // Rename the file to the new name
//       res.status(200).json({
//         message: `File ${filename} has been successfully updated.`,
//         filename: uploadedFile.originalname,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error instanceof Error ? error.message : Messages.ServerError });
//     }
//   },
// ];
