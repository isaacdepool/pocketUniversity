-- Usuario
CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, 
            apellido TEXT,
            avatar TEXT );
 
INSERT or IGNORE INTO usuario VALUES (1, 'Simon', 'depool', 'bhhl');

-- Evento
CREATE TABLE IF NOT EXISTS evento (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nombre TEXT,
            dia TEXT, 
            inicio TEXT,  
            fin TEXT,
            tipo TEXT,
            comentario TEXT, 
            id_usuario INTEGER );
 
-- Periodo
CREATE TABLE IF NOT EXISTS periodo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, 
            id_usuario INTEGER);

-- Materias
CREATE TABLE IF NOT EXISTS materias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, 
            id_usuario INTEGER,
            id_periodo INTEGER,
            id_evento INTEGER );

-- Cuaderno
CREATE TABLE IF NOT EXISTS cuaderno (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            titulo TEXT, 
            fecha_crea TEXT, 
            fecha_mod TEXT, 
            contenido TEXT, 
            id_usuario INTEGER,  
            id_materia INTEGER);

-- Archivos
CREATE TABLE IF NOT EXISTS archivos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            url TEXT, 
            nombre TEXT,  
            id_usuario INTEGER,
            id_cuaderno INTEGER );

-- Carpeta
CREATE TABLE IF NOT EXISTS carpeta (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nombre TEXT,
            id_usuario INTEGER,
            id_materia INTEGER);

INSERT or IGNORE INTO carpeta (id, nombre, id_usuario, id_materia )
                     VALUES (1, 'Otros', 1, 0);

 
-- Fotos
CREATE TABLE IF NOT EXISTS fotos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nombre TEXT,
            url TEXT, 
            fecha TEXT, 
            favorito INTEGER, 
            id_carpeta INTEGER,
            id_usuario INTEGER );

-- Finanzas
CREATE TABLE IF NOT EXISTS finanzas (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            gasto DECIMAL, 
            tipo_gasto TEXT, 
            descripcion TEXT,
            fecha TEXT,
            icono TEXT,
            id_usuario INTEGER );

CREATE TABLE IF NOT EXISTS configIni (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            dark INTEGER, 
            inicio INTEGER, 
            id_usuario INTEGER );

CREATE TABLE IF NOT EXISTS configDark (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            dark INTEGER, 
            id_usuario INTEGER );

INSERT or IGNORE INTO configIni (id, inicio, id_usuario )
                     VALUES (1, 0, 1);

INSERT or IGNORE INTO configDark (id, dark, id_usuario )
                     VALUES (1, 0, 1);



