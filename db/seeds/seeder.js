exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('PredefinedScripts')
      .del()
      .then(function () {
        // Inserts seed entries
        return knex('PredefinedScripts').insert([
          {
            part_1: 'Sample Predefined Script 1 - Part 1',
            part_2: 'Sample Predefined Script 1 - Part 2',
            part_3: 'Sample Predefined Script 1 - Part 3',
            part_4: 'Sample Predefined Script 1 - Part 4',
          },
          {
            part_1: 'Sample Predefined Script 2 - Part 1',
            part_2: 'Sample Predefined Script 2 - Part 2',
            part_3: 'Sample Predefined Script 2 - Part 3',
            part_4: 'Sample Predefined Script 2 - Part 4',
          },
        ]);
      })
      .then(function () {
        // Deletes ALL existing entries in the Users table
        return knex('Users').del();
      })
      .then(function () {
        // Inserts seed entries into the Users table
        return knex('Users').insert([
          {
            username: 'user1',
            subscription_key: 'key1',
            subscription_key_expiration_date: '2023-12-31',
          },
          {
            username: 'user2',
            subscription_key: 'key2',
            subscription_key_expiration_date: '2023-12-31',
          },
        ]);
      });
  };
   