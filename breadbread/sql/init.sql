DELIMITER $$

DROP PROCEDURE IF EXISTS insert_large_dummy_data $$
CREATE PROCEDURE insert_large_dummy_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT;
    DECLARE buyer_id BIGINT;
    DECLARE seller_id BIGINT;
    DECLARE chatroom_id BIGINT;

    WHILE i <= 3000 DO
            INSERT INTO users (social_id, user_role, name, notice_check, deleted, created_at, modified_at)
            VALUES (
                       CONCAT('social', i),
                       IF(i <= 500, 'SELLER', 'BUYER'),
                       CONCAT('User', i),
                       true,
                       false,
                       NOW(),
                       NOW()
                   );
            SET i = i + 1;
        END WHILE;

    SET i = 1;
    WHILE i <= 500 DO
            INSERT INTO bakery (
                authenticated, average_score, review_count,
                authentication_date, user_id,
                phone, business_number, name, address, homepage_url,
                created_at, modified_at
            )
            VALUES (
                       true,
                       ROUND(RAND() * 5, 2),
                       FLOOR(RAND() * 100),
                       NOW(),
                       i,
                       CONCAT('010-', LPAD(FLOOR(RAND() * 10000), 4, '0'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0')),
                       CONCAT('BN-', i),
                       CONCAT('Bakery', i),
                       CONCAT('Address ', i),
                       CONCAT('http://bakery', i, '.com'),
                       NOW(), NOW()
                   );
            SET i = i + 1;
        END WHILE;

    SET i = 1;
    WHILE i <= 5000 DO
            SET buyer_id = FLOOR(RAND() * 2500) + 501;
            SET seller_id = FLOOR(RAND() * 500) + 1;

            INSERT INTO chat_room (customer_id, owner_id, name, created_at, modified_at)
            VALUES (buyer_id, seller_id, CONCAT('ChatRoom', i), NOW(), NOW());

            SET chatroom_id = LAST_INSERT_ID();

            SET j = 1;
            WHILE j <= 30 DO
                    INSERT INTO chat (chat_room_id, sender_id, content, created_at, modified_at)
                    VALUES (
                               chatroom_id,
                               IF(RAND() > 0.5, buyer_id, seller_id),
                               CONCAT('Message ', j, ' in room ', i),
                               NOW(), NOW()
                           );
                    SET j = j + 1;
                END WHILE;

            SET i = i + 1;
        END WHILE;
END $$

DELIMITER ;

CALL insert_large_dummy_data();
