package com.docsphere.member;

import com.docsphere.member.dto.MemberDto;
import com.docsphere.user.UserMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface WorkspaceMemberMapper {
    MemberDto toDto(WorkspaceMember member);
}
