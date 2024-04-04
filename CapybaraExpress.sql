CREATE TABLE Album (
    user_id INT PRIMARY KEY,
    
    user_name VARCHAR(150) NOT NULL, 



    album_id INT PRIMARY KEY,
    album_record_label VARCHAR(150) NOT NULL,
    album_title VARCHAR(150) NOT NULL,
    album_price REAL NOT NULL,
    genre_id INT NOT NULL,
    albumtracks_track_number INT,
    FOREIGN KEY(genre_id) REFERENCES Genre(genre_id)
)ENGINE = InnoDB;

