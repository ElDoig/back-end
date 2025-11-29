import usuarioService from "../services/usuario.js";

const registrar = async (req,res) => {
    try {
        const { nombre, usuario, password, rol} = req.body;

        const response = await usuarioService.registrar({nombre, usuario, password, rol});

        if (response.success)
            return res.status(201).json(response);
        else
            return res.status(500).json(response);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error inesperado", error})
    }
}

const login = async(req,res) => {

    try {
        const { usuario, password } = req.body;

        const result = await usuarioService.login({ usuario, password});

    if (result.success)
        return res.status(200).json(result);
    else
        return res.status(500).json(result);
    
    } catch(err) {
        console.log(err);
    }
}

const controller = { registrar,login }

export default controller