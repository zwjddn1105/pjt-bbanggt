package com.breadbolletguys.breadbread.chat.domain.repository;

import static com.breadbolletguys.breadbread.chat.domain.QChat.chat;
import static com.breadbolletguys.breadbread.chat.domain.QChatRoom.chatRoom;
import static com.breadbolletguys.breadbread.user.domain.QUser.user;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatQueryRepositoryImpl implements ChatQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChatResponse> findByChatRoomId(Long chatRoomId, String pageToken, int pageSize) {
        return queryFactory.select(Projections.constructor(
                        ChatResponse.class,
                        chat.id,
                        user.id,
                        chat.chatRoomId,
                        chat.createdAt,
                        chat.content
                )).from(chat)
                .leftJoin(user).on(user.id.eq(chat.senderId))
                .where(isInRange(pageToken), chat.chatRoomId.eq(chatRoomId))
                .orderBy(chat.id.desc())
                .limit(pageSize + 1)
                .fetch();
    }

    @Override
    public List<ChatQueryResponse> findAllLastChatByRoomIds(List<Long> chatRoomIds) {
        return queryFactory.select(
                Projections.constructor(
                        ChatQueryResponse.class,
                        chat.chatRoomId,
                        chat.content
                )).from(chat)
                .leftJoin(chatRoom).on(chatRoom.id.eq(chat.chatRoomId))
                .where(chat.chatRoomId.in(chatRoomIds))
                .orderBy(chat.id.desc())
                .limit(1)
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return chat.id.lt(Long.valueOf(pageToken));
    }
}
