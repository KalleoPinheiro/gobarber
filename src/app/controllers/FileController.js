import File from '../models/FileModel';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    try {
      const file = await File.create({
        name,
        path,
      });
      return res.status(200).json(file);
    } catch (error) {
      return res.status(400).json({ error: 'Uploaded fail!' });
    }
  }
}

export default new FileController();
