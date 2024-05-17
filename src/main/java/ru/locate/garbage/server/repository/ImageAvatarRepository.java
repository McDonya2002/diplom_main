package ru.locate.garbage.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.locate.garbage.server.model.ImageFromUser;
import ru.locate.garbage.server.model.MyUser;
import ru.locate.garbage.server.model.UserAvatars;

public interface ImageAvatarRepository extends JpaRepository<UserAvatars, Long> {

    UserAvatars findByUser(MyUser user);

}
