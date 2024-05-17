package ru.locate.garbage.server.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.locate.garbage.server.model.*;
import ru.locate.garbage.server.model.ImageFromUser;
import ru.locate.garbage.server.service.AppService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/")
@AllArgsConstructor
@EnableMethodSecurity
public class ApiController {

    @Autowired private AppService appService;

    @GetMapping("/user/avatar")
    public ResponseEntity<UserAvatars> getAvatar(Authentication auth){
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUserAvatar(userDetails.getUsername()));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/user/avatar")
    public ResponseEntity<UserAvatars> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.setUserAvatar(file, userDetails.getUsername()));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("personal-data/password/change")
    public ResponseEntity<String> changePassword(@RequestParam("password") String password, Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        try {
            appService.changePassword(password, userDetails.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @PostMapping("/personal-data/change")
    public ResponseEntity<String> changePersonalData(
                                                     @RequestParam String login,
                                                     @RequestParam String name,
                                                     @RequestParam String surname,
                                                     @RequestParam String middleName)
    {
        try {
            appService.updateUserData(login, name, surname, middleName);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("points/{pointId}/close/{comment}")
    public ResponseEntity<String> closePointFromWorker(@PathVariable Long pointId, @PathVariable String comment){
        try {
            appService.closePointFromWorker(pointId, comment);
            return ResponseEntity.status(HttpStatus.OK).body("Точка закрыта");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/point/{pointId}/close")
    public ResponseEntity<String> finishWorkByWorker(@PathVariable Long pointId, @RequestParam("file") MultipartFile file){
        try {
            appService.finishWorkByWorker(pointId, file);
            return ResponseEntity.status(HttpStatus.OK).body("");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/point/worker")
    public ResponseEntity<List<Point>> getWorkers(Authentication auth){
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        try{
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllPointForWorkerByUsername(userDetails.getUsername()));
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    //Перевод точки на исполнение сотрудником
    @PostMapping("/point/{pointId}/worker/{login}")
    public ResponseEntity<String> addWorker(@PathVariable Long pointId, @PathVariable String login) {
        try {
            appService.changeWorker(login, pointId);
            return ResponseEntity.status(HttpStatus.OK).body("Сотрудник назначен");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Получение картинки для точки (ту которую добавил пользователь)
    @GetMapping("point/{point_id}/image")
    public ResponseEntity<List<ImageFromUser>> getImage(@PathVariable Long point_id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllImagesByPointId(point_id));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @GetMapping("/point/{point_id}/image/worker")
    public ResponseEntity<List<ImageFromWorker>> getImageWorker(@PathVariable Long point_id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllImagesFromWorkerByPointId(point_id));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<MyUser>> getUsers() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.findAll());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Смена логина пользователя
    @PostMapping("/user/login/change")
    public ResponseEntity<Void> changeLogin(@RequestBody MyUser user, Authentication auth) {
        try {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            appService.changeLogin(user.getName(), userDetails.getUsername());
            return ResponseEntity.ok().build();
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //получение логина пользователя (в рамках сессии)
    @GetMapping("/user/login")
    public String gerUsername(Authentication authentication){
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        return null;
    }

    @GetMapping("/points/admin")
    public ResponseEntity<List<Point>> getAdminPoints() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllPointsForAdmin());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Отказ точки админом
    @PostMapping("/points/reject/{pointId}")
    public ResponseEntity<String> RejectPoint(@PathVariable Long pointId, @RequestParam(required = false) String comment) {
        try {
            appService.rejectPoint(pointId, comment);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Получение всех точек для вывода на карту
    @GetMapping("/points")
    public ResponseEntity<List<Point>> getPoint(@RequestParam(required = false) String username){
        if (username != null) {
            List<Point> answer = appService.getAllPointsByUserName(username);
            return ResponseEntity.status(HttpStatus.OK).body(answer);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllPoints());
        }
    }
    //посиск id по маске
    @GetMapping("/user/name/{mask}")
    public ResponseEntity<List<MyUser>> getUsersByMask(@PathVariable String mask) {
        if (Objects.equals(mask, "-")){
            return ResponseEntity.status(HttpStatus.OK).body(appService.findAll());
        }
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUsersByMask(mask));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Получение точек по роли админом
    @GetMapping("/points/admin/{role}")
    public ResponseEntity<List<Point>> getAdminPointsByRole(@PathVariable String role) {
        if (Objects.equals(role, "-")) {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getAllPointsForAdmin());
        }
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getPointsByRole(role));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    //Получение всей инфы точки по id
    @GetMapping("/points/{pointId}")
    public ResponseEntity<Point> getPointById(@PathVariable Long pointId) {
        Point point = appService.getPointById(pointId);
        if (point != null) {
            return ResponseEntity.ok(point);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //получение роли пользователя по id
    @GetMapping("/user/{userId}/role")
    public ResponseEntity<String> getRoleById(@PathVariable Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getRoleById(userId));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Получение роли текущего пользователя (в рамках сессии)
    @GetMapping("/user/role")
    public ResponseEntity<String> getRole(Authentication authentication) {
        if (authentication != null) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return ResponseEntity.status(HttpStatus.OK).body(appService.getRoleByUsername(userDetails.getUsername()));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }

    //утановка роли пользователю по id
    @PostMapping("/user/{userId}/{role}")
    public ResponseEntity<Void> setRole(@PathVariable Long userId, @PathVariable String role) {
        try {
            appService.setRole(userId, role);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @PostMapping("/points")
    public ResponseEntity<String> addPoint(@RequestParam("file") MultipartFile file,
                                           @RequestParam("latitude") double latitude,
                                           @RequestParam("longitude") double longitude,
                                           @RequestParam("description") String description,
                                           @RequestParam("name") String name) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            appService.addPoint(latitude, longitude, description, username, file, name);
            return ResponseEntity.status(HttpStatus.OK).body("Point added successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while adding point");
        }
    }

    //Добавление нового юзера - регистрация
    @PostMapping("/new-user")
    public ResponseEntity<String> addUser(@RequestBody MyUser user) {
        if (appService.findByLogin(user.getName()) != null) {
            // Пользователь с таким именем уже существует
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("User with this username already exists");
        }
        try {
            appService.addUser(user);
            // Пользователь создан
            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            // Ошибка при создании пользователя
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user");
        }
    }

    //Получение ПД юзера
    @GetMapping("/personal-data")
    public ResponseEntity<MyUser> getPersonalData (Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String login = userDetails.getUsername();
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUserByLogin(login));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }
    //Получение ПД юзера
    @GetMapping("/personal-data/{userId}")
    public ResponseEntity<MyUser> getPersonalDataById (@PathVariable Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUserByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }



    //Замена данный пользователя
    @PatchMapping("/user")
    public ResponseEntity<String> updateUser(@RequestBody MyUser user) {
        try {
            appService.updateUser(user);
            return ResponseEntity.status(HttpStatus.OK).body("User updated successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //Получения списка ролей
    @GetMapping("roles")
    public ResponseEntity<List<String>> getAllRoles(){
        List<String> answer = new ArrayList<>();
        Roles[] roles = Roles.values();
        for (Roles role : roles) {
            answer.add(String.valueOf(role));
        }
        try {
            return ResponseEntity.status(HttpStatus.OK).body(answer);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //================Python====================

    @GetMapping("/admin/points/max_id")
    public ResponseEntity<Long> getMaxId() {
        return ResponseEntity.status(HttpStatus.OK).body(appService.getMaxId());
    }

    @GetMapping("/admin/points/min_id")
    public ResponseEntity<Long> getMinId() {
        return ResponseEntity.status(HttpStatus.OK).body(appService.getMinId());
    }

    @GetMapping("/admin/cluster")
    public ResponseEntity<Long> getAllClusterNumbers(){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getUniqueClusterNumber());
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/admin/points/cluster/{clusterNumber}")
    public ResponseEntity<List<Point>> getPointsByClusterNumber(@PathVariable Long clusterNumber){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(appService.getPointsByClusterId(clusterNumber));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/admin/points")
    public List<Point> getPointFromPython(@RequestParam(required = false) String username){
        if (username != null) {
            return appService.getAllPointsByUserName(username);
        } else {
            return appService.getAllPoints();
        }
    }

    @GetMapping("/admin/points/{pointId}")
    public ResponseEntity<Point> getPointByIdFromPython(@PathVariable Long pointId) {
        Point point = appService.getPointById(pointId);

        if (point != null) {
            return ResponseEntity.status(HttpStatus.OK).body(point);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/admin/points/clusters/{pointId}/{clusterNumber}")
    public ResponseEntity<String> updatePointCluster(@PathVariable Long pointId, @PathVariable Long clusterNumber){
        try {
            appService.UpdatePointClusterById(pointId, clusterNumber);
            return ResponseEntity.status(HttpStatus.OK).body("Point updated successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating point");
        }

    }

    @PatchMapping("/admin/points/place/{pointId}/{place}")
    public ResponseEntity<String> updatePointOPlace(@PathVariable Long pointId, @PathVariable Long place){
        try {
            appService.UpdatePointPlaceById(pointId, place);
            return ResponseEntity.status(HttpStatus.OK).body("Point updated successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating point");
        }

    }

    @PostMapping("/admin/points")
    public ResponseEntity<String> addPointFromPython(@RequestBody Point point){
        try {
            appService.addPointFromPython(point);
            return ResponseEntity.status(HttpStatus.OK).body("Point added successfully");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while adding point");
        }
    }
}
