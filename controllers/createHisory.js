import { History } from "../models/history.model.js";

export const createHistoryEntry = async (req, res) => {
  try {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const { actionName } = req.body;
    const history = new History({
      actionName,
      date,
      time
    });
    console.log('History:', history);
    await history.save();
    return res.status(200).json({ message: 'History was saved successfully' });
  } catch (error) {
    return res.status(401).json({ error: 'Failure in creating history' });
  }
};
