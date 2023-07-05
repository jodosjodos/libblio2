import { History } from "../models/history.model.js";
export const getAllHistoryEntries = async (req, res) => {
    try {
      const entries = await History.find();
      const formattedEntries = entries.map(entry => {
        const entryDate = new Date(entry.date).getDate();
        const currentDate = new Date().getDate();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  
        let formattedDate;
        if (entryDate === currentDate) {
          formattedDate = 'Today';
        } else if (entryDate === yesterdayDate.getDate()) {
          formattedDate = 'Yesterday';
        } else {
          formattedDate = new Date(entry.date).toDateString(); // Use your desired date format here
        }
  
        return {
          actionName: entry.actionName,
          date: formattedDate,
          time: entry.time
        };
      });
  
      res.status(200).json(formattedEntries);
    } catch (error) {
      console.error('Error fetching history entries:', error);
      res.status(500).json({ error: 'Failed to fetch history entries' });
    }
  };
  

  // export const getAllHistoryEntries = async (req, res) => {
  //   try {
  //     // Check if cached data exists in Redis
  //     redisClient.get('historyEntries', async (error, cachedData) => {
  //       if (error) {
  //         console.error('Redis error:', error);
  //       }
  
  //       if (cachedData) {
  //         // Cached data exists, parse and return it
  //         const parsedData = JSON.parse(cachedData);
  //         res.status(200).json(parsedData);
  //       } else {
  //         // Cached data doesn't exist, query the database
  //         const entries = await History.find();
  //         const formattedEntries = entries.map((entry) => {
  //           // Format the date logic...
  
  //           return {
  //             actionName: entry.actionName,
  //             date: formattedDate,
  //             time: entry.time,
  //           };
  //         });
  
  //         // Cache the formatted entries in Redis
  //         redisClient.set('historyEntries', JSON.stringify(formattedEntries));
  
  //         // Return the formatted entries
  //         res.status(200).json(formattedEntries);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error fetching history entries:', error);
  //     res.status(500).json({ error: 'Failed to fetch history entries' });
  //   }
  // };
  