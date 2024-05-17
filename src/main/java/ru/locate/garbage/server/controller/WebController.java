package ru.locate.garbage.server.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.locate.garbage.server.service.AppService;

import java.util.Objects;

@Controller
public class WebController {

    @Autowired public AppService appService;

    @GetMapping("/account")
    public String accountPage(Model model, Authentication auth){
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String role = appService.getRoleByUsername(userDetails.getUsername());
        if (Objects.equals(role, "USER"))
            return "lk/index-user";
        else if (Objects.equals(role, "ADMIN"))
            return "lk/index-admin";
        else
            return "lk/index-worker";
    }

    @GetMapping("/personal-data")
    public String PdPage(Model model){
        return "forms/change-user-data";
    }

    @GetMapping(value = "/map")
    public String getMapPage(Model model){
        return "map";
    }

    @GetMapping("/registration")
    public String regPage(Model model) {
        return "forms/registry-form";
    }

    @GetMapping("/new-point")
    public String addPoint(Model model) {
        return "forms/add-new-point";
    }

    @GetMapping("/admin-user-role-change")
    public String changeRole(Model model){
        return "lk/admin-user-role-change_1";
    }

    @GetMapping("/point-card")
    public String getPointCard(Model model, HttpServletRequest request, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = appService.getRoleByUsername(userDetails.getUsername());
        String point_id = request.getParameter("id");
        model.addAttribute("pointId", point_id);
        String statusForUser = appService.getPointStatusForUserById(Long.valueOf(point_id));
        String statusForWorker = appService.getPointStatusForWorkerById(Long.valueOf(point_id));
        if (Objects.equals(role, "USER"))
            if (Objects.equals(statusForUser, "Открыта") || Objects.equals(statusForUser, "Отклонена"))
                return "lk/card-page-user/index-opened";
            else if (Objects.equals(statusForUser, "Закрыта")){
                return "lk/card-page-user/index-closed";
            }
            else {
                return "lk/card-page-user/index-rejected";
            }
        else if (Objects.equals(role, "WORKER")){
            if (Objects.equals(statusForWorker, "Закрыть"))
                return "lk/card-page-worker/close-point";
            else
                return "lk/card-page-worker/point-closed";
        }
        else{
            if (statusForWorker == null){
                return "lk/card-page-admin/card-from-user";
            }
            else
                return "lk/card-page-admin/card-from-worker";
        }

    }

    @GetMapping("/login/index")
    public String login(Model model) {
        return "index";
    }

    @GetMapping("/signin")
    public String signin(Model model) {
        return "forms/login-form";
    }

    @GetMapping("/reject-point-user")
    public String rejectPointUser(Model model) {
        return "forms/reject-point-user";
    }

    @GetMapping("/aprove-point-user")
    public String approvePointUser(Model model) {
        return "forms/aprove-point-user";
    }

    @GetMapping("/reject-point-worker")
    public String rejectPointWorker(Model model) {
        return "forms/reject-point-worker";
    }

    @GetMapping("/aprove-point-worker")
    public String approvePointWorker(Model model) {
        return "forms/aprove-point-worker";
    }

    @GetMapping("/changeUserPassword")
    public String changeUserPassword(Model model) {
        return "forms/change-password-form";
    }

}
