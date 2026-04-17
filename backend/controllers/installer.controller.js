const installerService = require("../services/installer.service");

const install = async (req, res) => {

    try {

        const result = await installerService.install();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = { install };