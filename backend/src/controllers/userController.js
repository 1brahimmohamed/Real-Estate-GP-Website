const usersData = [
    {
        id: 1,
        name: 'User 1',
        email: '',
        password: '',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        name: 'User 2',
        email: '',
        password: '',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 3,
        name: 'User 3',
        email: '',
        password: '',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 4,
        name: 'User 4',
        email: '',
        password: '',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 5,
        name: 'User 5',
        email: '',
        password: '',
        image: 'https://via.placeholder.com/150'
    }
];

exports.checkID = (req, res, next, val) => {
    console.log(`User id is: ${val}`);
    if (req.params.id * 1 > usersData.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or description'
        });
    }
    next();
};

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            usersLength: usersData.length,
            users: usersData

        }
    });
};
exports.getUser = (req, res) => {
    const id = parseInt(req.params.id);
    const user = usersData.find(user => user.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
};
exports.updateUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: '<Updated user>'
        }
    });
}
exports.deleteUser = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};
exports.createUser = (req, res) => {
    console.log(req.body);
    res.send('Done');
};
