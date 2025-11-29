--productos 

INSERT INTO productos (titulo, descripcion, precio, categoria, img, "createdAt", "updatedAt")
VALUES
  ('Playstation 5', 'Consola de videojuegos', 2500.00, 'Consolas', 'https://plazavea.vteximg.com.br/arquivos/ids/29033795-1000-1000/20404194.jpg', NOW(),NOW()),
  ('Nintendo Switch 2', 'Consola de videojuegos', 2900.00, 'Consolas', 'https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/2534/PMP20000870001/full_image-1.jpeg', NOW(),NOW()),
  ('Ghost of Yotei Collector''s Edition', 'Edición de colección de Ghost of Yotei', 1000.00, 'Videojuegos', 'https://press-start.com.au/wp-content/uploads/2025/04/Ghost-of-YOtei-CE-1.jpg', NOW(),NOW()),
  ('EAFC26 Ultimate edition', 'Edición Ultima de EAFC 26', 300.00, 'Videojuegos', 'https://gamescenter.pe/wp-content/uploads/2025/07/FC-26-Ultimate-Edition-PS5.webp', NOW(),NOW());


-- tiendas
INSERT INTO tiendas (nombre, direccion, "createdAt", "updatedAt")
VALUES
('Videojuegos Katty - Surco', 'Av. Sin Nombre 123', NOW(), NOW()),
('Diversiones Fantasia', 'Larcomar tienda N-23', NOW(), NOW()),
('Importaciones Daniel', 'Av. Javier Prado 123', NOW(), NOW());

-- usuario
INSERT INTO usuarios (nombre, usuario, "password", rol, "createdAt", "updatedAt")
VALUES
('Juan Perez', 'jperez', '$2b$10$mCyOLn9Wz0bXA4/geTihKO61sliHwlq0F5AfbhyjFjeeChv6KTWx2', 'Admin', NOW(), NOW());

