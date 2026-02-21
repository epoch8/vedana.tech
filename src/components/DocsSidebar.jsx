import React, { useMemo, useState, useEffect } from 'react';
import { Menu, ConfigProvider } from 'antd';

function normalizeDocSlug(slug) {
    const normalized = slug
        .split('/')
        .map(part => part.replace(/^\d+-/, ''))
        .join('/');

    return normalized;
}

const theme = {
    token: {
        colorPrimary: '#2563eb',
        fontFamily: 'inherit',
        colorBgContainer: 'transparent',
        colorBorderSecondary: 'transparent',
    },
    components: {
        Menu: {
            itemBg: 'transparent',
            subMenuItemBg: 'transparent',
            itemHoverBg: 'rgba(37, 99, 235, 0.08)',
            itemSelectedBg: 'rgba(37, 99, 235, 0.1)',
            itemSelectedColor: '#2563eb',
        }
    }
};

export default function DocsSidebar({ allDocs, currentSlug }) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    const menuItems = useMemo(() => {
        const sectionsMap = {};
        const rootItems = [];

        allDocs.forEach(doc => {
            const { slug, data } = doc;
            const { title, section, order = 0 } = data;

            const slugParts = slug.split('/');
            let explicitSectionOrder = 0;
            let explicitPageOrder = 0;

            let cleanSectionSlug = '';
            if (slugParts.length > 1) {
                const sm = slugParts[0].match(/^(\d+)-(.*)/);
                if (sm) {
                    explicitSectionOrder = parseInt(sm[1], 10);
                    cleanSectionSlug = sm[2];
                } else {
                    cleanSectionSlug = slugParts[0];
                }
            }

            const lastPart = slugParts[slugParts.length - 1];
            const pm = lastPart.match(/^(\d+)-(.*)/);
            let cleanPageSlug = lastPart;
            if (pm) {
                explicitPageOrder = parseInt(pm[1], 10);
                cleanPageSlug = pm[2];
            }

            const cleanTotalSlug = normalizeDocSlug(slug);

            let effectiveSection = section;
            if (!effectiveSection && slugParts.length > 1) {
                effectiveSection = cleanSectionSlug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            const finalOrder = (order !== 0) ? order : explicitPageOrder;
            const finalSectionOrder = explicitSectionOrder;

            const finalTitle = title || cleanPageSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const item = {
                key: cleanTotalSlug,
                label: <a href={`/docs/${cleanTotalSlug}`}>{finalTitle}</a>,
                order: finalOrder,
            };

            if (effectiveSection) {
                if (!sectionsMap[effectiveSection]) {
                    sectionsMap[effectiveSection] = { items: [], order: finalSectionOrder };
                } else if (finalSectionOrder > 0 && sectionsMap[effectiveSection].order === 0) {
                    sectionsMap[effectiveSection].order = finalSectionOrder;
                }
                sectionsMap[effectiveSection].items.push(item);
            } else {
                rootItems.push(item);
            }
        });

        rootItems.sort((a, b) => a.order - b.order);
        Object.values(sectionsMap).forEach(sec => sec.items.sort((a, b) => a.order - b.order));

        const sideMenuItems = [];

        const sortedSections = Object.entries(sectionsMap).sort((a, b) => a[1].order - b[1].order);

        sortedSections.forEach(([sectionName, secData]) => {
            sideMenuItems.push({
                key: `section-${sectionName}`,
                label: <span style={{ fontWeight: 600 }}>{sectionName}</span>,
                children: secData.items,
            });
        });

        sideMenuItems.push(...rootItems);

        return sideMenuItems;
    }, [allDocs]);

    const defaultOpenKeys = useMemo(() => {
        return menuItems
            .filter(item => item.children && item.children.some(child => child.key === currentSlug))
            .map(item => item.key);
    }, [menuItems, currentSlug]);

    if (!isClient) {
        return <div style={{ width: 250, padding: 16 }}>Loading navigation...</div>;
    }

    return (
        <ConfigProvider theme={theme}>
            <Menu
                mode="inline"
                selectedKeys={[currentSlug]}
                defaultOpenKeys={defaultOpenKeys}
                items={menuItems}
                style={{ height: '100%', borderRight: 0, paddingRight: 16 }}
            />
        </ConfigProvider>
    );
}
