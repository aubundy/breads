import { Title, AppShell } from "@mantine/core";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Title
          style={{ paddingInlineStart: "var(--mantine-spacing-xs)" }}
          order={1}
        >
          Breads
        </Title>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
