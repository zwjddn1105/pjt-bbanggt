package com.breadbolletguys.breadbread.chat.domain.repository;

import static com.breadbolletguys.breadbread.chat.domain.QChatRoom.chatRoom;
import static com.breadbolletguys.breadbread.user.domain.QUser.user;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatRoomQueryRepositoryImpl implements ChatRoomQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChatRoomQueryResponse> findAllByBuyerId(Long userId, String pageToken, int pageSize) {
        return queryFactory.select(
                Projections.constructor(
                        ChatRoomQueryResponse.class,
                        chatRoom.id,
                        chatRoom.name,
                        chatRoom.ownerId,
                        chatRoom.customerId,
                        user.name,
                        chatRoom.createdAt
                ))
                .from(chatRoom)
                .leftJoin(user).on(chatRoom.customerId.eq(user.id))
                .where((chatRoom.ownerId.eq(userId)
                        .or(chatRoom.customerId.eq(userId))
                                .and(isInRange(pageToken))
                )).orderBy(chatRoom.id.desc())
                .limit(pageSize + 1)
                .fetch();
    }

    @Override
    public Page<ChatRoomQueryResponse> findAllBySellerId(Long userId, Pageable pageable) {
        var data = queryFactory.select(
                        Projections.constructor(
                                ChatRoomQueryResponse.class,
                                chatRoom.id,
                                chatRoom.name,
                                chatRoom.ownerId,
                                chatRoom.customerId,
                                user.name,
                                chatRoom.createdAt
                        )).from(chatRoom)
                .from(chatRoom)
                .leftJoin(user).on(chatRoom.customerId.eq(user.id))
                .where((chatRoom.ownerId.eq(userId)
                        .or(chatRoom.customerId.eq(userId))
                )).orderBy(chatRoom.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(chatRoom)
                .from(chatRoom)
                .where(chatRoom.customerId.eq(chatRoom.customerId)
                        .or(chatRoom.ownerId.eq(chatRoom.ownerId)))
                .fetchCount();

        return new PageImpl<>(data, pageable, total);
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return chatRoom.id.lt(Long.valueOf(pageToken));
    }
}
