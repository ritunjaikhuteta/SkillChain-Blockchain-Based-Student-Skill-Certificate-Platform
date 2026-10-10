package com.skillchain.repository;

import com.skillchain.model.BlockchainBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockchainBlockRepository extends JpaRepository<BlockchainBlock, Long> {

    Optional<BlockchainBlock> findByHash(String hash);

    Optional<BlockchainBlock> findByCredentialId(String credentialId);

    Optional<BlockchainBlock> findByCertificateFingerprint(String certificateFingerprint);

    Optional<BlockchainBlock> findByCertificateId(Long certificateId);

    Optional<BlockchainBlock> findTopByOrderByBlockIndexDesc();

    List<BlockchainBlock> findAllByOrderByBlockIndexAsc();

    boolean existsByCertificateId(Long certificateId);

    boolean existsByCredentialId(String credentialId);

    boolean existsByCertificateFingerprint(String certificateFingerprint);

    long countByRevokedTrue();
}
