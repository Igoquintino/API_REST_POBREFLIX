import catalogModel from "../models/catalogModel.js";
import externalApiController from "../controllers/externalApiController.js";

const catalogController = {

    async getAllCatalog(req, res) { // Lista todos o catalogo OK! USER  
        try {

            const creatorUserType = req.createUserType;
            console.log(creatorUserType);
           
            if (creatorUserType !== "Administrator" && creatorUserType !== "Client"){
                return res.status(403).json({
                    error: "Só usuário da PobreFlix podem visualizar todo o Catálogo.",
                });
            }


            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({ 
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas." 
                });
            }
            const catalog = await catalogModel.selectAllCatalog();
            res.json(catalog);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar todos os filmes: ${err.message}` });
        }
    },
    
    // Rota para consultar filmes por tipo
    async getCatalogByType(req, res){ // Lista todos pelo tipo Catálogo OK! USER 
        try {

            const creatorUserType = req.createUserType;
    
            if (creatorUserType !== "Administrator" && creatorUserType !== "Client"){
                return res.status(403).json({
                    error: "Só usuário da PobreFlix podem visualizar o Catálogo.",
                });
            }

            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
                });
            }
            const catalog = await catalogModel.selectCatalogByType(req.params.content_type);
            res.json(catalog);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar filmes: ${err.message}` });
        }
    },
    
    // Rota para consultar filme pelo título
    async getCatalogByTitle(req, res) { // Lista Todos pelo title Catálogo OK! USER
        try {
            
            const creatorUserType = req.createUserType;
           
            if (creatorUserType !== "Administrator" && creatorUserType !== "Client"){
                return res.status(403).json({
                    error: "Só usuário da PobreFlix podem visualizar o titulo do Catálogo.",
                });
            }

            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
                });
            }


            const catalog = await catalogModel.selectCatalogByTitle(req.params.title);
            res.json(catalog);  
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar filme: ${err.message}` });
        }
    },
    
    async getCatalogById(req, res) { // Busca por ID
        try {
            const creatorUserType = req.createUserType;
    
            if (creatorUserType !== "Administrator" && creatorUserType !== "Client") {
                return res.status(403).json({
                    error: "Só usuários da PobreFlix podem visualizar o título do Catálogo.",
                });
            }
    
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
                });
            }
    
            const catalog = await catalogModel.selectCatalogByID(req.params.id); // Passa o ID
            res.json(catalog);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar filme: ${err.message}` });
        }
    },

    // Rota para adicionar um filme ao catálogo
    async createCatalog(req, res){ // Adicionar filme no catalogo OK! ADM
        try {

             // Tipo padrão: todos os usuários comuns são criados como Client
            const creatorUserType = req.createUserType;
            console.log(creatorUserType);

            const { title, description, genre, content_type, video_url } = req.body; // tirei o image_url
            console.log("esse é o titulo:   ",title);
            
            const poster_url = await externalApiController.getMoviePoster(title);
            console.log(title);
            console.log(poster_url);
            console.log("type: ", creatorUserType)

            const movie = await catalogModel.addToCatalog(title, description, genre, content_type, video_url, poster_url, creatorUserType);
            console.log(movie);
            res.status(201).json(movie);
        } catch (err) {
            res.status(500).json({ error: `Erro ao cadastrar filme: ${err.message}` });
        }
    },
    
    // Rota para atualizar um filme no catálogo
    // async upCatalog (req, res) { // Atualizar filme no catalogo OK! ADM
    //     try {

    //         const { id } = req.params;
    //         const { title, description, genre, content_type, video_url } = req.body;

    //         const creatorUserType = req.createUserType;
    //         console.log(`Usuário autenticado: ${creatorUserType}`);
    
    //         // validações de atualização
    //         if (creatorUserType !== 'Administrator') {
    //             return res.status(403).json({
    //                 error: "Apenas administradores podem alterar o Catalógo.",
    //             });
    //         }

    //         if (!title && !description && !genre && !content_type && !video_url) {
    //             return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
    //         }
    
    //         if (content_type && !['filme', 'serie'].includes(content_type)) {
    //             return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
    //         }
    
    //         // consulta ao banco e atualização
    //         const movie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url });
    
    //         if (!movie) {
    //             return res.status(404).json({ error: "Filme ou Serie não encontrado para atualização." });
    //         }
    
    //         res.status(200).json(movie);
    //     } catch (err) {
    //         res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    //     }
    // }
    // async upCatalog(req, res) { // Atualizar filme no catalogo OK! ADM
    //     try {
    //         const { id } = req.params;
    //         const { title, description, genre, content_type, video_url } = req.body;
    
    //         const creatorUserType = req.createUserType;
    //         console.log(`Usuário autenticado: ${creatorUserType}`);
    
    //         // Validações de atualização
    //         if (creatorUserType !== 'Administrator') {
    //             return res.status(403).json({
    //                 error: "Apenas administradores podem alterar o Catálogo.",
    //             });
    //         }
    
    //         if (!title && !description && !genre && !content_type && !video_url) {
    //             return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
    //         }
    
    //         if (content_type && !['filme', 'serie'].includes(content_type)) {
    //             return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
    //         }
    
    //         // Busca o filme atual no banco de dados
    //         const currentMovie = await catalogModel.getCatalogById(id);
    //         if (!currentMovie) {
    //             return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
    //         }
    
    //         // Verifica se o título foi alterado
    //         let poster_url = currentMovie.poster_url; // Mantém o poster atual por padrão
    //         if (title && title !== currentMovie.title) {
    //             // Se o título foi alterado, busca o novo poster
    //             try {
    //                 poster_url = await externalApiController.getMoviePoster(title);
    //                 console.log("Novo poster encontrado:", poster_url);
    //             } catch (err) {
    //                 console.error("Erro ao buscar novo poster:", err.message);
    //                 // Se não encontrar um novo poster, mantém o poster atual
    //                 poster_url = currentMovie.poster_url;
    //             }
    //         }
    
    //         // Atualiza o filme no banco de dados
    //         const updatedMovie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url, poster_url });
    
    //         if (!updatedMovie) {
    //             return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
    //         }
    
    //         res.status(200).json(updatedMovie);
    //     } catch (err) {
    //         console.error("Erro ao atualizar filme:", err.message);
    //         res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    //     }
    // },
    // async upCatalog(req, res) { // Atualizar filme no catalogo OK! ADM
    //     try {
    //         const { id } = req.params;
    //         const { title, description, genre, content_type, video_url } = req.body;
    
    //         const creatorUserType = req.createUserType;
    //         console.log(`Usuário autenticado: ${creatorUserType}`);
    
    //         // Validações de atualização
    //         if (creatorUserType !== 'Administrator') {
    //             return res.status(403).json({
    //                 error: "Apenas administradores podem alterar o Catálogo.",
    //             });
    //         }
    
    //         if (!title && !description && !genre && !content_type && !video_url) {
    //             return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
    //         }
    
    //         if (content_type && !['filme', 'serie'].includes(content_type)) {
    //             return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
    //         }
    
    //         // Busca o filme atual no banco de dados
    //         const currentMovie = await catalogModel.selectCatalogByID(id);
    //         if (!currentMovie || currentMovie.length === 0) {
    //             return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
    //         }
    
    //         // Verifica se o título foi alterado
    //         let poster_url = currentMovie[0].poster_url; // Mantém o poster atual por padrão
    //         if (title && title !== currentMovie[0].title) {
    //             // Se o título foi alterado, busca o novo poster
    //             try {
    //                 poster_url = await externalApiController.getMoviePoster(title);
    //                 console.log("Novo poster encontrado:", poster_url);
    //             } catch (err) {
    //                 console.error("Erro ao buscar novo poster:", err.message);
    //                 // Se não encontrar um novo poster, mantém o poster atual
    //                 poster_url = currentMovie[0].poster_url;
    //             }
    //         }
    
    //         // Atualiza o filme no banco de dados
    //         const updatedMovie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url, poster_url });
    
    //         if (!updatedMovie) {
    //             return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
    //         }
    
    //         res.status(200).json(updatedMovie);
    //     } catch (err) {
    //         console.error("Erro ao atualizar filme:", err.message);
    //         res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    //     }
    // },
    // Atualizar filme no catálogo (Controller)
async upCatalog(req, res) {
    try {
        const { id } = req.params;
        const { title, description, genre, content_type, video_url } = req.body;

        const creatorUserType = req.createUserType;
        console.log(`Usuário autenticado: ${creatorUserType}`);

        if (creatorUserType !== 'Administrator') {
            return res.status(403).json({ error: "Apenas administradores podem alterar o Catálogo." });
        }

        if (!title && !description && !genre && !content_type && !video_url) {
            return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
        }

        if (content_type && !['filme', 'serie'].includes(content_type)) {
            return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
        }

        // Busca o filme atual no banco de dados
        const currentMovie = await catalogModel.selectCatalogByID(id);
        if (!currentMovie || currentMovie.length === 0) {
            return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
        }

        // Verifica se o título foi alterado
        let image_url = currentMovie[0].image_url; // Mantém o image_url atual
        console.log(title)
        if (title && title !== currentMovie[0].title) {
            try {
                image_url = await externalApiController.getMoviePoster(title);
                console.log("Novo pôster encontrado:", image_url);
            } catch (err) {
                console.error("Erro ao buscar novo pôster:", err.message);
                image_url = currentMovie[0].image_url; // Mantém o antigo caso falhe
            }
        }

        // Atualiza o filme no banco de dados
        const updatedMovie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url, image_url });

        if (!updatedMovie) {
            return res.status(404).json({ error: "Filme ou Série não encontrado para atualização." });
        }

        res.status(200).json(updatedMovie);
    } catch (err) {
        console.error("Erro ao atualizar filme:", err.message);
        res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    }
},

    
    // Rota para excluir um filme do catálogo
    async deleteCatalog(req, res) { // Excluir filme no catalogo OK! ADM
        try {
            const { id } = req.params;
            
            const creatorUserType = req.createUserType;

            // Apenas administradores podem excluir outros usuários
            if (creatorUserType !== 'Administrator') {
                console.log(req.userType);
                return res.status(403).json({ error: "Acesso proibido. Apenas administradores podem excluir conteúdo do catalógo." });
            }

            const deletedMovie = await catalogModel.deleteMovie(id);
    
            if (!deletedMovie) {
                return res.status(404).json({ error: "Filme não encontrado." });
            }
    
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: `Erro ao excluir filme: ${err.message}` });
        }
    }
};

export default catalogController;
