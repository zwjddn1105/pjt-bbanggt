package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.Space;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SpaceJdbcRepository {

    private static final String BULK_INSERT_QUERY =
            "INSERT INTO "
            + "space(vending_machine_id, occupied, height, width, deleted) "
            + "VALUES (?, ?, ?, ?, ?)";

    private final JdbcTemplate jdbcTemplate;

    public void bulkInsert(List<Space> spaces) {
        jdbcTemplate.batchUpdate(BULK_INSERT_QUERY, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int index) throws SQLException {
                Space space = spaces.get(index);
                ps.setLong(1, space.getVendingMachineId());
                ps.setBoolean(2, space.isOccupied());
                ps.setInt(3, space.getHeight());
                ps.setInt(4, space.getWidth());
                ps.setBoolean(5, space.isDeleted());
            }

            @Override
            public int getBatchSize() {
                return spaces.size();
            }
        }
        );
    }
}
