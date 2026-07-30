package com.ecommerce.project.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.project.security.services.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthTokenFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("\n==================================================");
        System.out.println("FILTER START");
        System.out.println("REQUEST URI  = " + request.getRequestURI());
        System.out.println("SERVLET PATH = " + request.getServletPath());
        System.out.println("==================================================");

        String path = request.getServletPath();

        if (path.startsWith("/images/")
                || path.startsWith("/api/public/")
                || path.equals("/favicon.ico")) {

            System.out.println("SKIPPING FILTER FOR : " + path);

            filterChain.doFilter(request, response);
            return;
        }

        logger.info("===== AUTH FILTER EXECUTED =====");

        try {

            String jwt = parseJwt(request);

            logger.info("JWT FOUND : {}", jwt != null);

            if (jwt != null) {
                logger.info("JWT TOKEN : {}", jwt);
            }

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {

                logger.info("JWT IS VALID");

                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                logger.info("USERNAME FROM JWT : {}", username);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                logger.info("USER FOUND : {}", userDetails.getUsername());

                logger.info("AUTHORITIES : {}", userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.info("AUTHENTICATION SUCCESS");

                // ===== NEW DEBUG LOGS =====
                System.out.println("-----------------------------------");
                System.out.println("SECURITY CONTEXT AFTER LOGIN");
                System.out.println(SecurityContextHolder.getContext().getAuthentication());
                System.out.println("-----------------------------------");

            } else {

                logger.error("JWT INVALID OR NULL");
            }

        } catch (Exception e) {

            logger.error("AUTHENTICATION ERROR", e);
            e.printStackTrace();
        }

        System.out.println("FILTER END");
        System.out.println("==================================================\n");

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {

        String jwtFromCookie = jwtUtils.getJwtFromCookies(request);

        logger.info("JWT FROM COOKIE : {}", jwtFromCookie);

        if (jwtFromCookie != null) {
            return jwtFromCookie;
        }

        String jwtFromHeader = jwtUtils.getJwtFromHeader(request);

        logger.info("JWT FROM HEADER : {}", jwtFromHeader);

        return jwtFromHeader;
    }
}