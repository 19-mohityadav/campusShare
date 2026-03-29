import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Item from '../models/Item.js';
import connectDB from '../config/db.js';

dotenv.config();

// Seeder data
const users = [
    {
        name: 'Mohit Yadav',
        email: 'mohit@college.edu',
        password: 'password123',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt-KUWB6l4pHblnHfVKCaFj1Pqu9HOrvLmwI9m93A86iU5hJVVKVXNGcGCjLiWlwaud5wmqZStKJNyjP5dWwzHQBtDZy7xAVPQHysvQXEfnuCwvNz7lS2fppfs7BmSrGDAy0LPoVsVhTgZSInmkVPHlQQ5Ax4mjCQwp8aNGkLvXVRRhcR0yDZgyTpuoIloCBF4VBfaE1CLIHP20dhW0z8Lf88rBgLGCaTr6Lzn811dSlhBfT9oOyUP2VdT4pLHsGjhLOCGonCzGEw',
        rating: 4.9,
        trustScore: 100
    },
    {
        name: 'Raj S.',
        email: 'raj@college.edu',
        password: 'password123',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACfBkH9gXO3tcMG4ZtwC3YtOLyGeWxrDxZEMBrHHU2zp73xurswlnM6ePI9cEphlEFdPR3TyCB3QQ2PBApcONTKRaTN4u6E0_41wu40mLkKLmEbFVfXTXSw_q9EIoP145KEL7r3OIcgfs0acUWN8lhZ8nGINAIIXDvsAZtDHut1lY0MCtYm1EKM7T2lIRgB7dk0gwAEmp0ooq71_Gl0roB6BgDwsuBHqmvCrU-xRnpQjjYrDc5SIOR-YeVR-CxEosUtP7rAaSKE10',
        rating: 4.8,
        trustScore: 98
    },
    {
        name: 'Aman K.',
        email: 'aman@college.edu',
        password: 'password123',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcdwcX5jDufwv9hdez8h5gHBzuGujzWG8sfQtZbhM67v4vJmvzEJzkPvWMvUrlZ1Q-3s0uYOuSamqndxDyybFjGxyKbh838rfV8KCYJ_y8bMrDiNENdkLOAE6zMPeVMrkZKFo-NXGwoqqL3xhTEu5wxvF82ltATu8jCSH1nc3gCKKgMb34IBmMrXGEOkSadhfecSWS85FTUkVZJ67YnRYAKpP3KBGNzkG-LRxjtOK8YXV8y9iFkZKJlXHG5FX6ZHOjKWk_0Fi3Aw4',
        rating: 4.5,
        trustScore: 95
    }
];

const importData = async () => {
    try {
        await connectDB();

        await Item.deleteMany();
        await User.deleteMany();

        // Hash passwords for each user
        const salt = await bcrypt.genSalt(10);
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, salt);
        }

        const createdUsers = await User.insertMany(users);
        const mohitId = createdUsers[0]._id;
        const rajId = createdUsers[1]._id;
        const amanId = createdUsers[2]._id;

        const items = [
            {
                title: 'Scientific Calculator',
                description: 'Casio FX-991EX, perfect for engineering exams. Excellent condition.',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOT_-0ItIXw-is5Q1XUAQt0ZArtR-ZYdUhhfhH2wfATESCcTklqV4IiKJ9jeivHjVoarYgwm_4SGv7euG7WSun_YnnV3AzDgSdl2v5rUHakojSdt2NqHRIgcQjp-uk0Zm-oZuOhkd8rJrI8e9Kittn_nvLU--wBeachVyf8fQrf1jdBG09FgFtsuTvxB_kaFyFRlhEodUl0kwson3Uco7oo2X2Xk0Bh5KRSwv3i7eHXviuhEhbRbNx2nV5n6YMh1f8bftzGwRR6f4',
                category: 'Calculator',
                owner: rajId,
                availability: 'Available for next 10 days',
                location: 'Zone A - Main Campus Library'
            },
            {
                title: 'Drawing Kit',
                description: 'Full geometry kit with drawing sheet holders for first-year design courses.',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9YBWc8RHlAQ_8w3OJtrVWjeOXbaFHuKy1Bq3gV2btzsdtIG2alKKjqtNGE3WvgjTAUVdIMufqNnBtwnjPFl0fePNq4DgwSH8k7iK7irMwCJJ7OMndxoLgASdrDsSgKlgjjQdolqsrzu40HNw2wcMugf9hIG84XA16SwtI6KS6bJ8EztAMCYIzbBUvt-fl151Pl5DG0BTXHmi04ZY8rIkXzCZvna7eiIcxrSmB-jz6HUa_EX9cVl1qjbTjYtPOLMfpzTjDOYe8pi0',
                category: 'Lab Tools',
                owner: amanId,
                availability: 'Available till weekend',
                location: 'Vishwavidyalay Station'
            },
            {
                title: 'Physics Textbook Vol 2',
                description: 'Resnick Halliday fundamental physics textbook. Second volume.',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC5ROEA0jxpNSaLLe8XPUclEl85zGkTwTnHLX4AchrIka1ZoKCC2qeCcjs0Pp2M87R8GMh0gheHM6TvBi77KX_zivYi-w92Dz62Pkhu4vDZ9rgeCWpHvoSpe3xeO4Fcw40kRDq0SNiZY0f_QdpQixUbDjBpZTylReAc1gNGO186dPGTNE_r4NQ4hLFqEq-_8Fs7Zzwc8sI2SmTI89UaG9eHiwm_bFnSCtHQkQWi1JYrAoyc7nNSkC7XB8BD8r7uxzo4sT96NMP62I',
                category: 'Books',
                owner: mohitId,
                availability: 'Always available',
                location: 'Hostel Block 4'
            }
        ];

        await Item.insertMany(items);

        console.log('✅ Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importing data: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Item.deleteMany();
        await User.deleteMany();

        console.log('🗑️ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error destroying data: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
