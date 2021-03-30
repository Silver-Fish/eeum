package com.ssafy.eeum.qr.domain;

import com.ssafy.eeum.account.domain.Account;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString
@NoArgsConstructor
@Table(name="qr")
public class QR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="qr_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Account account;

    private String title;

    @Lob
    private String qrUrl;

    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccountQr> accountQrs = new ArrayList<>();

    @Builder
    public QR(String title, String qrUrl) {
        this.title = title;
        this.qrUrl = qrUrl;
    }

    public void setQrUrl(String qrUrl) {
        this.qrUrl = qrUrl;
    }

    public void update(QR requestQr) {
        this.title = requestQr.title;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
