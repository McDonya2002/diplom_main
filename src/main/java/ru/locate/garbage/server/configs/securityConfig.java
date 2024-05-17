package ru.locate.garbage.server.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import ru.locate.garbage.server.service.MyUserDetailsService;

@Configuration
@EnableWebSecurity
public class securityConfig {


    @Bean
    public UserDetailsService userDetailsService(){
        return new MyUserDetailsService();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/map").permitAll()
                        .requestMatchers("/api/v1/points").permitAll()
                        .requestMatchers("/api/v1/new-user").permitAll()
                        .requestMatchers("api/v1/admin/**").permitAll()
                        .requestMatchers("/api/v1/**").authenticated()
                        .requestMatchers("/account").authenticated()
                        .requestMatchers("/point-card/**").authenticated()
                        .requestMatchers("/new-point").authenticated()
                        .requestMatchers("/personal-data").authenticated()
                        .requestMatchers("/points/admin").authenticated()
                        .requestMatchers("/**").permitAll())
                .formLogin(AbstractAuthenticationFilterConfigurer::permitAll)
                .formLogin(form -> {
                    form.loginPage("/signin").loginProcessingUrl("/login").permitAll();
                    form.defaultSuccessUrl("/");
                })
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
