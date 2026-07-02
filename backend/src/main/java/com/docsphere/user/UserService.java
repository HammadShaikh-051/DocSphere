package com.docsphere.user;

import com.docsphere.user.dto.ChangePasswordRequest;
import com.docsphere.user.dto.UpdateProfileRequest;
import com.docsphere.user.dto.UserDto;

import java.util.UUID;

public interface UserService {
    UserDto getUserById(UUID userId);

    UserDto updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userID, ChangePasswordRequest request);
}
